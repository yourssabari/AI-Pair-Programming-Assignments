def get_proper_divisors(number):
    """
    Find all proper divisors of a number.
    
    Args:
        number (int): The number to find divisors for
    
    Returns:
        list: List of proper divisors
    """
    divisors = []
    for i in range(1, number):
        if number % i == 0:
            divisors.append(i)
    return divisors

def is_perfect_number(number):
    """
    Check if a number is perfect.
    A perfect number is a positive integer that is equal to the sum of its proper divisors.
    
    Args:
        number (int): The number to check
    
    Returns:
        bool: True if the number is perfect, False otherwise
    """
    if number < 1:
        return False
    
    divisors = get_proper_divisors(number)
    return sum(divisors) == number

def main():
    # Get input from user
    try:
        num = int(input("Enter a number to check if it's perfect: "))
        if is_perfect_number(num):
            print(f"{num} is a perfect number")
            print(f"Its proper divisors are: {get_proper_divisors(num)}")
        else:
            print(f"{num} is not a perfect number")
    except ValueError:
        print("Please enter a valid positive integer")

if __name__ == "__main__":
    main()