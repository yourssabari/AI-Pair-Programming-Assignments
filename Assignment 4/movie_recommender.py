import pandas as pd
import os
import sys

class MovieRecommendationSystem:
    def __init__(self, csv_file_path):
        """
        Initialize the Movie Recommendation System with a CSV file
        
        Args:
            csv_file_path (str): Path to the CSV file containing movie data
        """
        self.csv_file_path = csv_file_path
        self.movies_df = None
        self.load_movies()
    
    def load_movies(self):
        """
        Load movies from CSV file with error handling
        """
        try:
            # Check if file exists
            if not os.path.exists(self.csv_file_path):
                raise FileNotFoundError(f"CSV file not found: {self.csv_file_path}")
            
            # Load the CSV file
            self.movies_df = pd.read_csv(self.csv_file_path)
            
            # Validate required columns
            required_columns = ['title', 'genre', 'rating', 'year']
            missing_columns = [col for col in required_columns if col not in self.movies_df.columns]
            
            if missing_columns:
                raise ValueError(f"Missing required columns: {missing_columns}")
            
            # Convert rating to numeric, handling any non-numeric values
            self.movies_df['rating'] = pd.to_numeric(self.movies_df['rating'], errors='coerce')
            
            # Remove rows with invalid ratings
            self.movies_df = self.movies_df.dropna(subset=['rating'])
            
            print(f"Successfully loaded {len(self.movies_df)} movies from CSV file.")
            
        except FileNotFoundError as e:
            print(f"Error: {e}")
            sys.exit(1)
        except ValueError as e:
            print(f"Error: {e}")
            sys.exit(1)
        except Exception as e:
            print(f"Unexpected error loading CSV file: {e}")
            sys.exit(1)
    
    def get_available_genres(self):
        """
        Get list of unique genres available in the dataset
        
        Returns:
            list: Sorted list of unique genres
        """
        if self.movies_df is None:
            return []
        
        return sorted(self.movies_df['genre'].unique().tolist())
    
    def get_top_movies_by_genre(self, genre, top_n=5):
        """
        Get top N highest-rated movies for a specific genre
        
        Args:
            genre (str): Genre to filter by
            top_n (int): Number of top movies to return (default: 5)
        
        Returns:
            pandas.DataFrame: Top movies in the specified genre
        """
        try:
            # Filter movies by genre (case-insensitive)
            genre_movies = self.movies_df[
                self.movies_df['genre'].str.lower() == genre.lower()
            ]
            
            if genre_movies.empty:
                return pd.DataFrame()
            
            # Sort by rating in descending order and get top N
            top_movies = genre_movies.nlargest(top_n, 'rating')
            
            return top_movies
            
        except Exception as e:
            print(f"Error filtering movies: {e}")
            return pd.DataFrame()
    
    def display_movies(self, movies_df, genre):
        """
        Display movies in a formatted way
        
        Args:
            movies_df (pandas.DataFrame): DataFrame containing movies to display
            genre (str): Genre that was searched for
        """
        if movies_df.empty:
            print(f"\nNo movies found for genre: {genre}")
            print("Available genres:", ", ".join(self.get_available_genres()))
            return
        
        print(f"\nTop {len(movies_df)} highest-rated {genre} movies:")
        print("-" * 80)
        print(f"{'Rank':<4} {'Title':<40} {'Rating':<8} {'Year':<6}")
        print("-" * 80)
        
        for idx, (_, movie) in enumerate(movies_df.iterrows(), 1):
            title = movie['title'][:37] + "..." if len(movie['title']) > 40 else movie['title']
            print(f"{idx:<4} {title:<40} {movie['rating']:<8.1f} {int(movie['year']):<6}")
    
    def get_user_input(self):
        """
        Get genre input from user with validation
        
        Returns:
            str: Valid genre entered by user, or None to quit
        """
        available_genres = self.get_available_genres()
        
        print("\n" + "="*60)
        print("🎬 MOVIE RECOMMENDATION SYSTEM 🎬")
        print("="*60)
        print(f"Dataset contains {len(self.movies_df)} movies")
        print(f"Available genres: {', '.join(available_genres)}")
        print("-"*60)
        
        while True:
            try:
                genre = input("\nEnter a genre (or 'quit' to exit): ").strip()
                
                if genre.lower() in ['quit', 'exit', 'q']:
                    return None
                
                if not genre:
                    print("Please enter a valid genre.")
                    continue
                
                # Check if genre exists (case-insensitive)
                genre_exists = any(g.lower() == genre.lower() for g in available_genres)
                
                if not genre_exists:
                    print(f"Genre '{genre}' not found.")
                    print(f"Available genres: {', '.join(available_genres)}")
                    continue
                
                return genre
                
            except KeyboardInterrupt:
                print("\n\nProgram interrupted by user. Goodbye!")
                return None
            except Exception as e:
                print(f"Error getting user input: {e}")
                continue
    
    def run(self):
        """
        Main method to run the movie recommendation system
        """
        try:
            while True:
                genre = self.get_user_input()
                
                if genre is None:
                    print("Thank you for using the Movie Recommendation System!")
                    break
                
                # Get top 5 movies for the genre
                top_movies = self.get_top_movies_by_genre(genre, 5)
                
                # Display results
                self.display_movies(top_movies, genre)
                
                # Ask if user wants to continue
                print("\n" + "-"*60)
                continue_choice = input("Would you like to search for another genre? (y/n): ").strip().lower()
                
                if continue_choice in ['n', 'no']:
                    print("Thank you for using the Movie Recommendation System!")
                    break
                    
        except Exception as e:
            print(f"An unexpected error occurred: {e}")


def main():
    """
    Main function to start the movie recommendation system
    """
    # Path to the CSV file
    csv_file = "movies_hollywood_bollywood_kollywood.csv"
    
    print("Starting Movie Recommendation System...")
    
    # Create and run the recommendation system
    recommender = MovieRecommendationSystem(csv_file)
    recommender.run()


if __name__ == "__main__":
    main()
