def is_armstrong_number(number: int) -> bool:
    """
    Check if the given number is an Armstrong number.

    An Armstrong number is an n-digit number that is equal to the sum of its own digits
    each raised to the power of n.

    Args:
        number (int): The number to check.

    Returns:
        bool: True if the number is an Armstrong number, False otherwise.
    """
    digits = [int(d) for d in str(number)]
    power = len(digits)
    total = sum(d ** power for d in digits)
    return total == number

# Example usage:
if __name__ == "__main__":
    num = int(input("Enter a number: "))
    if is_armstrong_number(num):
        print(f"{num} is an Armstrong number.")
    else:
        print(f"{num} is not an Armstrong number.")