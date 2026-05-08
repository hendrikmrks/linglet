import os

dirs = [
    r'C:\Users\hbe\Documents\Privat\linglet\src\app\api\user\missed-xp',
    r'C:\Users\hbe\Documents\Privat\linglet\src\app\api\user\estimated-rank'
]

for d in dirs:
    os.makedirs(d, exist_ok=True)
    print(f'Created: {d}')

# Verify they exist
for d in dirs:
    if os.path.isdir(d):
        print(f'Verified: {d}')
    else:
        print(f'ERROR: {d} does not exist')
