package com.aies.aies.service;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.aies.aies.pojo.Account;
import com.aies.aies.pojo.TransctionEvent;
import com.aies.aies.pojo.model.ModelCreditor;
import com.aies.aies.pojo.model.ModelDebtor;
import com.aies.aies.pojo.model.ModelTransction;
import com.aies.aies.repo.TransctionEventRepo;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class TransctionModelService {

    private  TransctionEventRepo transctionEventRepo;

    private  KafkaTemplate<String,ModelTransction> kafkaTemplate;

    private final String Scheme = "CUSTOMER-ID";

    public TransctionModelService( TransctionEventRepo transctionEventRepo ,
                                    KafkaTemplate<String,ModelTransction> kafkaTemplate

    ) {
            this.transctionEventRepo = transctionEventRepo;
            this.kafkaTemplate = kafkaTemplate;
    }


    public ModelTransction handlTxn(TransctionEvent transctionEvent) {

        Account debitor_account = transctionEvent.getDebtor().getAccount();
        Account creditor_account = transctionEvent.getCreditor().getAccount();

        ModelTransction modelTransction = new ModelTransction();

        modelTransction.setCurrentTransctionEvent(transctionEvent);
        
        if(Scheme.equals(debitor_account.getScheme())) {
            ModelDebtor modelDebtor = new ModelDebtor();
            modelDebtor.setDebtor(transctionEvent.getDebtor());
            modelDebtor.setLast10TransctionEventsDebits(transctionEventRepo.findByDebtor_Account_Id( debitor_account.getId(), PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "transactionDate"))));
             modelDebtor.setLast10TransctionEventsCredits(transctionEventRepo.findByCreditor_Account_Id( debitor_account.getId(), PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "transactionDate"))));
            modelTransction.setModelDebtor(modelDebtor);
        }

        if(Scheme.equals(creditor_account.getScheme())) {
            ModelCreditor modelCreditor = new ModelCreditor();
            modelCreditor.setCreditor(transctionEvent.getCreditor());
            modelCreditor.setLast10TransctionEventsDebits(transctionEventRepo.findByDebtor_Account_Id( creditor_account.getId(), PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "transactionDate"))));
             modelCreditor.setLast10TransctionEventsCredits(transctionEventRepo.findByCreditor_Account_Id( creditor_account.getId(), PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "transactionDate"))));
            modelTransction.setModelCreditor(modelCreditor);
        }

        kafkaTemplate.send("model-txn", modelTransction);
        log.info("Message Sent Check in kafka");

        return modelTransction;

        // Go to the Kafka template about to get that


    }
}
