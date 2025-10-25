package com.aies.aies.pojo;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.Data;

@Data
@Entity
public class Debtor {

    @Id
    private String id;
    private String name;
    @JsonProperty("account")
    @ManyToOne   // Many Debtor Transactions can use the same account
    private Account account;
}
