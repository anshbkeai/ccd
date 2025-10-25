package com.aies.aies.pojo;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class InstructedAmount {

    @Id
    private String id;
    private String currency;
    private double amount;
}
