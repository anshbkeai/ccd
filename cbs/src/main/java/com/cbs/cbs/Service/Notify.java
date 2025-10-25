package com.cbs.cbs.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.cbs.cbs.Repo.TransctionEventRepo;
import com.cbs.cbs.pojo.ModelResponse;
import com.cbs.cbs.pojo.TransctionEvent;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class Notify {

    @Autowired
    private SseService sseService;

    @Autowired
    private TransctionEventRepo transctionEventRepo;


    // @KafkaListener(topics = "notification-prod")
    // public void consume(TransctionEvent transctionEvent) {
    //     log.info("Consumed TransctionEvent: {}", transctionEvent);
    //     sseService.sendEvent(transctionEvent);
    // }

}
