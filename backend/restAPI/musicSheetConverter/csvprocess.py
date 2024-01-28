import csv

note_factors = {
    'whole': 4,
    'half': 2,
    'quarter': 1,
    'eighth': 0.5,
    'sixteenth': 0.25,
}

def calculate_duration(bpm, duration_factor):
    return int(60000 / bpm *  duration_factor)

def parse_csv_file(file_path, bpm):
    notes = []
    with open(file_path, 'r') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            duration_factor = note_factors.get(row['type'], 1)
            duration = calculate_duration(bpm, duration_factor)
            stem = 'down'
            if row['note'] == 'C2':
                stem = 'up'
            notes.append({'note': row['note'], 'time': duration, 'stem': stem})
    return notes

# Example
file_path_csv = 'test.csv'
bpm = 80 
parsed_notes_csv = parse_csv_file(file_path_csv, bpm)
print(parsed_notes_csv)
