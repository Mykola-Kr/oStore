package com.krainyk.ostore.exceptions;

public class NoMatchesException extends RuntimeException {

    public NoMatchesException() {
    }

    public NoMatchesException(String message) {
        super(message);
    }
}
