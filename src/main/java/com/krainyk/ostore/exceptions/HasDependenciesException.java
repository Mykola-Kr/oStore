package com.krainyk.ostore.exceptions;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class HasDependenciesException extends RuntimeException {

    public HasDependenciesException(String message) {
        super(message);
    }
}
