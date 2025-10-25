package com.cbs.cbs.pojo;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class Payment {

    @JsonProperty("fromAccount")
    private Account fromAccount;
    @JsonProperty("toAccount")
    private Account toAccount;

    @JsonProperty("note")
    private String note;

    @JsonProperty("amount")
    private double amount;

}
