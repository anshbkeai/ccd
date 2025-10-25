package com.aies.aies.pojo;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.Data;

@Data
@Entity
public class Creditor {

    @JsonProperty("id")
    @Id
    private String id;
    @JsonProperty("name")
    private String name;
    @JsonProperty("account")
    @ManyToOne   // Many Debtor Transactions can use the same account
    private Account account;
}
