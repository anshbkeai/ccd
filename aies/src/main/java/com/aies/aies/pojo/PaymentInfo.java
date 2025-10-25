package com.aies.aies.pojo;



import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import lombok.Data;

@Data
@Entity
public class PaymentInfo {

    @Id
    private String id;
    private String instructionId;
    @OneToOne
    private InstructedAmount instructedAmount;
}
