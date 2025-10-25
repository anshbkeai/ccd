package com.aies.aies.service;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.aies.aies.pojo.TransctionEvent;

@Service
public class TransctionConsumer {

    private TransctionModelService modelService;
    public TransctionConsumer(TransctionModelService modelService ) {
        this.modelService = modelService;
    }
    @KafkaListener(topics = "txn-topic", groupId = "my-group" )
    public void consumeTxn(TransctionEvent transctionEvent) {
        TransctionEvent event = (TransctionEvent) transctionEvent;
        System.out.println("ThE consumer is Consumein this. and ok "+ transctionEvent.toString());
        modelService.handlTxn(transctionEvent);
    }
}
