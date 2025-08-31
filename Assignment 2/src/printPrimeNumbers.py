
def sieve_primes(n):
	"""Return a list of booleans is_prime[0..n], True if index is prime."""
	if n < 2:
		return [False] * (n + 1)
	is_prime = [False, False] + [True] * (n - 1)
	p = 2
	while p * p <= n:
		if is_prime[p]:
			for multiple in range(p * p, n + 1, p):
				is_prime[multiple] = False
		p += 1
	return is_prime


def primes_in_range(start, end):
	"""Return a list of primes in the inclusive range [start, end]."""
	if end < 2 or end < start:
		return []
	start = max(start, 2)
	is_prime = sieve_primes(end)
	return [i for i in range(start, end + 1) if is_prime[i]]


if __name__ == "__main__":
	try:
		a = int(input("Enter start of range: ").strip())
		b = int(input("Enter end of range: ").strip())
	except ValueError:
		print("Please enter valid integers.")
		raise SystemExit(1)

	if a > b:
		print("Start must be <= end.")
		raise SystemExit(1)

	primes = primes_in_range(a, b)
	if primes:
		print("Primes in range [{}, {}]:".format(a, b))
		print(' '.join(map(str, primes)))
	else:
		print("No primes found in the given range.")

