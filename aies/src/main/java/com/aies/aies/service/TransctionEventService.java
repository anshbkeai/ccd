package com.aies.aies.service;

import java.util.Optional;

import org.springframework.stereotype.Service;


import com.aies.aies.pojo.TransctionEvent;
import com.aies.aies.pojo.model.ModelResponse;
import com.aies.aies.repo.TransctionEventRepo;

import jakarta.transaction.Transactional;



@Service
public class TransctionEventService {

    private final TransctionEventRepo transctionEventRepo ;
    public TransctionEventService(TransctionEventRepo transctionEventRepo) {
        this.transctionEventRepo =transctionEventRepo;
    }

  
    @Transactional
    public void markTransction(TransctionEvent transctionEvent) {
        Optional<TransctionEvent> transctionEventOptional = transctionEventRepo.findById(transctionEvent.getId());
        if(transctionEventOptional.isPresent()) {
            TransctionEvent existingTransctionEvent = transctionEventOptional.get();
            existingTransctionEvent.setFlaged(transctionEvent.isFlaged());
            existingTransctionEvent.setReason(transctionEvent.getReason());
            transctionEventRepo.save(existingTransctionEvent);
        }
    }
}
