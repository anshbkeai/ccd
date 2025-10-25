package com.aies.aies.pojo.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class ModelResponse {

    @JsonProperty("transactionEventId") // maps JSON "transactionEventId" → this field
    private String transctionEventId;

    @JsonProperty("flagged") // maps JSON "flagged" → this field
    private boolean flaged;

    private String reason; // if JSON has the same name, no need for annotation
}

