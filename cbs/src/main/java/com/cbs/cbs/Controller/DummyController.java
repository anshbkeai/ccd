package com.cbs.cbs.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cbs.cbs.Service.DummyService;
import com.cbs.cbs.pojo.Account;
import com.cbs.cbs.pojo.Payment;
import com.cbs.cbs.pojo.TransctionEvent;

import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("/dummy")
@CrossOrigin("*")
public class DummyController {

    @Autowired
    private DummyService dummyService;

    @GetMapping("/{id}")
    public ResponseEntity<Account> getAccount(@PathVariable String id) {
        Account acc = dummyService.getAccountById(id);
        return (acc!=null)?new ResponseEntity<Account>(acc, HttpStatus.OK):new ResponseEntity<>(HttpStatus.FORBIDDEN);
    }

    @GetMapping("/{id}/last10txn")
    public ResponseEntity<List<TransctionEvent>> getMethodName(@PathVariable String id) {
        return new ResponseEntity<List<TransctionEvent>>(dummyService.last10TransctionEvents(id), HttpStatus.OK);
    }
    
    

    @PostMapping("/pay")
    public String postMethodName(@RequestBody Payment payment) {
        //TODO: process POST request
        dummyService.pay(payment);
        return "ok";
    }

    @GetMapping("/bank/flagged")
    public ResponseEntity<Page<TransctionEvent>> flaged(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size

    ) {
        return new ResponseEntity<Page<TransctionEvent>>(dummyService.flaged(page, size), HttpStatus.OK);
    }
    
    
}
