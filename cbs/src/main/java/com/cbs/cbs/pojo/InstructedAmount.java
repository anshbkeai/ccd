package com.cbs.cbs.pojo;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class InstructedAmount {

    @Id
    private String id;
    private String currency;
    private double amount;
}
