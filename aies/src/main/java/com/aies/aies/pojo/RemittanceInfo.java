package com.aies.aies.pojo;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class RemittanceInfo {

    @Id
    private String id;
    @JsonProperty("unstructured")
    private String unstructured;
}
