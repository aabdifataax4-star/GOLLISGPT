import sys

with open("style.css", "r") as f:
    content = f.read()

count = 0
for i, c in enumerate(content):
    if c == '{':
        count += 1
    elif c == '}':
        count -= 1
        if count < 0:
            print(f"Extra closing brace at index {i}")
            sys.exit(0)

if count > 0:
    print(f"Missing {count} closing braces")
else:
    print("Braces are balanced")

