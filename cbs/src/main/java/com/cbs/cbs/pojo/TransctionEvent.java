package com.cbs.cbs.pojo;

import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@JsonIgnoreProperties(ignoreUnknown = true)
@NoArgsConstructor
@AllArgsConstructor
public class TransctionEvent {

    @Id
    private String id;
    @JsonProperty("paymentInfo")
    @OneToOne(cascade = CascadeType.ALL)
    private PaymentInfo paymentInfo;
    @JsonProperty("debtor")
     @ManyToOne(cascade = CascadeType.ALL)
    private Debtor debtor;
    @JsonProperty("creditor")
     @ManyToOne(cascade = CascadeType.ALL)
    private Creditor creditor;
    @JsonProperty("remittanceInfo")
    @OneToOne(cascade = CascadeType.ALL)
    private RemittanceInfo remittanceInfo;

    @JsonProperty("transactionDate")
    @Column(name="transaction_date", nullable=false)
    private Instant transactionDate; 

    @JsonProperty("flaged")
    private boolean flaged;
    @JsonProperty("reason")
    private String reason;
}
