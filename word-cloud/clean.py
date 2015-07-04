#!/bin/python3

import unicodedata
import sys

filt = dict.fromkeys(i for i in range(sys.maxunicode) if not unicodedata.category(chr(i)).startswith('L'))

def main():
    if len(sys.argv) != 2:
        print("Usage:", sys.argv[0], "[input file]")
        exit()
    for i in range(128):
        filt[i] = None
    with open(sys.argv[1]) as f:
        outf = open(sys.argv[1] + ".out", "w")
        outf.write(f.read().translate(filt))

if __name__ == '__main__':
    main()
