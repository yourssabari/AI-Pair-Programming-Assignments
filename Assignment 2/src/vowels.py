# Print the number of vowels in the given string
def count_vowels(input_string):
    vowels = "aeiouAEIOU"
    count = 0
    for char in input_string:
        if char in vowels:
            count += 1
    return count

# main
if __name__ == "__main__":
    test_string = "Hello, World!"
    print("Number of vowels:", count_vowels(test_string))