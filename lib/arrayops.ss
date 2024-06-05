lib arrayops;

use array;

fn foreach(array, callback) {
    len = array_length(array);
    i = 0;
    while i < len {
        callback(array_at(i), i);
        i = i + 1;
    }
}

fn map(array, callback) {
    new_array = array();
    len = array_length(array);
    i = 0;
    while i < len {
        array_add(new_array, callback(array_at(i), i));
        i = i + 1;
    }
}

fn filter(array, callback) {
    new_array = array();
    len = array_length(array);
    i = 0;
    while i < len {
        elm = array_at(i);
        if callback(elm, i) {
            array_add(new_array, elm);
        }
        i = i + 1;
    }
}

fn any(array, callback) {
    len = array_length(array);
    i = 0;
    while i < len {
        if callback(array_at(i), i) {
            ret true;
        }
        i = i + 1;
    }
    ret false;
}

fn all(array, callback) {
    len = array_length(array);
    i = 0;
    while i < len {
        if !callback(array_at(i), i) {
            ret false;
        }
        i = i + 1;
    }
    ret true;
}

fn array_slice(array, start, end) {
    new_array = array();
    i = start;
    while i < end {
        array_add(new_array, array_at(i));
    }
    ret new_array;
}

fn array_has(array, element) {
    ret any(array, (elm) => elm = element);
}

fn array_concat(array1, array2) {
    new_array = array();
    foreach(array1, (elm) => array_add(new_array, elm));
    foreach(array2, (elm) => array_add(new_array, elm));
    ret new_array;
}