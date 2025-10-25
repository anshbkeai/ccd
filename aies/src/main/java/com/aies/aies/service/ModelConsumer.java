package com.aies.aies.service;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.aies.aies.pojo.TransctionEvent;
import com.aies.aies.pojo.model.ModelResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ModelConsumer {

    private KafkaTemplate<String,TransctionEvent> kafkaTemplate;
    private final TransctionEventService transctionEventService;
    private final ObjectMapper mapper = new ObjectMapper();

    public ModelConsumer(KafkaTemplate<String,TransctionEvent> kafkaTemplate,
            TransctionEventService transctionEventService
    ) {
        this.kafkaTemplate = kafkaTemplate;
        this.transctionEventService =transctionEventService;
    }
    @KafkaListener(topics = "model-resp-txn" , groupId = "my-group")
    public void consumeModelResp(TransctionEvent transctionEvent) {

        if(transctionEvent.isFlaged()) {
            // Send to the Notifcation Serice and then Save to the DB and thus the Notifiaction how to add in the ui the point is this . so notifactio will add and then can see about the table we cna have about that this txn was so they will Query the Db. why should i. care about that
            kafkaTemplate.send("notification-prod", transctionEvent);  // bank
            transctionEventService.markTransction(transctionEvent);
            log.info("The Txn {} is Saved as faaged in the db " , transctionEvent.getId());

        }

        // log the Event in the Audit and logging Modelue
        log.info("Consumed the Response of the Model from  {}" , transctionEvent.getId());
    }
}
