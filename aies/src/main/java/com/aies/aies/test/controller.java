package com.aies.aies.test;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aies.aies.pojo.TransctionEvent;
import com.aies.aies.pojo.model.ModelResponse;
import com.aies.aies.pojo.model.ModelTransction;
import com.aies.aies.repo.TransctionEventRepo;
import com.aies.aies.service.TransctionModelService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
@RequestMapping("/")
public class controller {

    private prod producer;
    private consumer cons;
    private TransctionEventRepo transctionEventRepo;
    private TransctionModelService transctionModelService;
     private KafkaTemplate<String,ModelResponse> kafkaTemplate;

    public controller(prod producer , consumer cons , TransctionEventRepo transctionEventRepo,TransctionModelService transctionModelService,
                  KafkaTemplate<String,ModelResponse> kafkaTemplate
    ) {
        this.producer = producer;
        this.cons =cons;
        this.transctionEventRepo = transctionEventRepo;
        this.transctionModelService = transctionModelService;
        this.kafkaTemplate = kafkaTemplate;
    }

    @PostMapping("/txn")
    public String postMethodName(@RequestBody TransctionEvent transctionEvent) {
        //TODO: process POST request
        
        producer.Send(transctionEvent);
        return new String("OK");
    }

    @GetMapping("{id}")
    public List<TransctionEvent> getMethodName(@PathVariable String id) {
        PageRequest pageRequest = PageRequest.of(0, 10);
        return transctionEventRepo.findByDebtor_Account_Id(id,pageRequest);
    }

    @PostMapping("/get")
    public ModelTransction getTxn(@RequestBody TransctionEvent transctionEvent) {
        //TODO: process POST request
        
        return transctionModelService.handlTxn(transctionEvent);
    }

    @PostMapping("modelresp")
    public String tes(@RequestBody ModelResponse modelResponse) {
        //TODO: process POST request
        kafkaTemplate.send("model-resp-txn", modelResponse);
        
        return "Check ";
    }
    
    
    

    
}
