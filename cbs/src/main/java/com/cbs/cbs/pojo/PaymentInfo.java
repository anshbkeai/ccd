package com.cbs.cbs.pojo;



import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class PaymentInfo {

    @Id
    private String id;
    private String instructionId;
    @OneToOne(cascade = CascadeType.ALL)
    private InstructedAmount instructedAmount;
}
