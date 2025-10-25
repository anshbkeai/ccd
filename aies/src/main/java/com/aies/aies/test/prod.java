package com.aies.aies.test;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import com.aies.aies.pojo.TransctionEvent;

import jakarta.annotation.PostConstruct;

@Component
public class prod {
    private final KafkaTemplate<String, TransctionEvent> kafkaTemplate;

   
    public prod(KafkaTemplate<String, TransctionEvent>  kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    /*
     * {
	"paymentInfo": {
		"instructionId": "TXN-ID-ABC-123",
		"instructedAmount": {
			"currency": "INR",
			"amount": 140000.0
		}
	},
	"debtor": {
		"name": "Pune Institute of Technology",
		"account": {
			"id": "pune.institute@icicibank",
			"scheme": "CUST123"
		}
	},
	"creditor": {
		"name": "Pune Institute of Technology",
		"account": {
			"id": "pune.institute@icicibank",
			"scheme": "CUST123"
		}
	},
	"remittanceInfo": {
		"unstructured": "Payment for Semester 5 Fees, Student ID 9876"
	}
}
     * 
     */
    @PostConstruct
    public void init() {

    }

    public void Send(TransctionEvent transctionEvent ) {
        kafkaTemplate.send("txn-topic", transctionEvent); // using the Compretiable Future 
        System.out.println("✅ Sent message: " + transctionEvent.toString());

    }

   
    
}
