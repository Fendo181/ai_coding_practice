<?php

// FizzBuzz constants
const FIZZ_DIVISOR = 3;
const BUZZ_DIVISOR = 5;
const FIZZBUZZ_DIVISOR = 15;
const FIZZ_TEXT = "fizz";
const BUZZ_TEXT = "buzz";
const FIZZBUZZ_TEXT = "fizzbuzz";
const DELIMITER = ", ";

// fizzbuzz function
function fizzbuzz($n) {
    $result = [];
    for ($i = 1; $i <= $n; $i++) {
        switch (true) {
            case ($i % FIZZBUZZ_DIVISOR == 0):
                $result[] = FIZZBUZZ_TEXT;
                break;
            case ($i % FIZZ_DIVISOR == 0):
                $result[] = FIZZ_TEXT;
                break;
            case ($i % BUZZ_DIVISOR == 0):
                $result[] = BUZZ_TEXT;
                break;
            default:
                $result[] = $i;
                break;
        }
    }
    return implode(DELIMITER, $result);
}

// Example usage
echo fizzbuzz(15); // Output: 1, 2, fizz, 4, buzz, fizz, 7, 8, fizz, buzz, 11, fizz, 13, 14, fizzbuzz