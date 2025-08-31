# •Print all the factors of a given number

def print_factors(n):
    factors = []
    for i in range(1, n + 1):
        if n % i == 0:
            factors.append(i)
    return factors

number = 28
print("Factors of", number, "are:", print_factors(number))