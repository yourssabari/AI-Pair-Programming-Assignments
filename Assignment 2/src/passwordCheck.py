
import re

def is_valid_password(password):
	# At least one uppercase letter
	has_upper = re.search(r'[A-Z]', password)
	# At least one lowercase letter
	has_lower = re.search(r'[a-z]', password)
	# At least one digit
	has_digit = re.search(r'[0-9]', password)
	# At least one special character (non-alphanumeric)
	has_special = re.search(r'[^A-Za-z0-9]', password)
	return all([has_upper, has_lower, has_digit, has_special])

if __name__ == "__main__":
	pwd = input("Enter password: ")
	if is_valid_password(pwd):
		print("Valid password")
	else:
		print("Invalid password. Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.")
