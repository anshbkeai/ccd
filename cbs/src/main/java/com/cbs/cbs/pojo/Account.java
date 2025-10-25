package com.cbs.cbs.pojo;


import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class Account {

    @JsonProperty("id")
    @Id
    private String id;
    @JsonProperty("scheme")
    private String scheme;

    

}
