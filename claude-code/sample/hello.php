<?php

// fizzbuzz function
function fizzbuzz($n) {
    $result = [];
    for ($i = 1; $i <= $n; $i++) {
        switch (true) {
            case ($i % 3 == 0 && $i % 5 == 0):
                $result[] = "fizzbuzz";
                break;
            case ($i % 3 == 0):
                $result[] = "fizz";
                break;
            case ($i % 5 == 0):
                $result[] = "buzz";
                break;
            default:
                $result[] = $i;
                break;
        }
    }
    return implode(", ", $result);
}

// Example usage
echo fizzbuzz(15); // Output: 1, 2, fizz, 4, buzz, fizz, 7, 8, fizz, buzz, 11, fizz, 13, 14, fizzbuzz