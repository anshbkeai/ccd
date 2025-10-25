package com.aies.aies.pojo.model;

import com.aies.aies.pojo.TransctionEvent;

import lombok.Data;

@Data
public class ModelTransction {

    private TransctionEvent currentTransctionEvent;
    private ModelDebtor modelDebtor;
    private ModelCreditor modelCreditor;
}
