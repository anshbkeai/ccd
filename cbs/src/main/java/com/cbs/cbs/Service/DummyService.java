package com.cbs.cbs.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.cbs.cbs.Repo.AccountRepo;
import com.cbs.cbs.Repo.TransctionEventRepo;
import com.cbs.cbs.pojo.Account;
import com.cbs.cbs.pojo.Creditor;
import com.cbs.cbs.pojo.Debtor;
import com.cbs.cbs.pojo.InstructedAmount;
import com.cbs.cbs.pojo.Payment;
import com.cbs.cbs.pojo.PaymentInfo;
import com.cbs.cbs.pojo.RemittanceInfo;
import com.cbs.cbs.pojo.TransctionEvent;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class DummyService {

    @Autowired
    private AccountRepo accountRepo;

    @Autowired
    private TransctionEventRepo  transctionEventRepo;

    @Autowired
    private KafkaTemplate<String,TransctionEvent> kafkaTemplate;

    public Account getAccountById(String id) {
        Optional<Account> opt =  accountRepo.findById(id);
        return opt.isPresent()? opt.get():null;
    }

    @Transactional
    public void pay(Payment payment) {
        String uuid =UUID.randomUUID().toString();
        Debtor debtor = new Debtor("DEBTOR-"+uuid.substring(0,8), "TEST-"+uuid.substring(0,8), payment.getFromAccount());
        Creditor creditor = new Creditor("CREDITOR-"+uuid.substring(0,8), "test-"+uuid.substring(0,8), payment.getToAccount());
        InstructedAmount instructedAmount = new InstructedAmount("AMT-"+uuid.substring(0,8), "INR", payment.getAmount());
        PaymentInfo paymentInfo = new PaymentInfo("PAY-"+uuid.substring(0,8), "INST-"+uuid.substring(0,8), instructedAmount);
        // TransctionEvent transctionEvent = new Transctio
        RemittanceInfo remittanceInfo = new RemittanceInfo("REM-"+uuid.substring(0,8), payment.getNote());
        // transctionEvent.setCreditor(creditor);
        TransctionEvent transctionEvent = new TransctionEvent(uuid, paymentInfo, debtor, creditor, remittanceInfo, Instant.now(), false, null);
        log.info("Transaction Event: {}", transctionEvent.toString());
        transctionEventRepo.save(transctionEvent);

        kafkaTemplate.send("txn-topic", transctionEvent);
        
    
    }


    public List<TransctionEvent> last10TransctionEvents(String id) {
        List<TransctionEvent> list = transctionEventRepo.findByDebtor_Account_Id(id, PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "transactionDate")));
        list.addAll(transctionEventRepo.findByCreditor_Account_Id(id, PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "transactionDate"))));
        return list;
    }

     public Page<TransctionEvent> flaged(int page, int size) {
        return transctionEventRepo.findByFlagedTrue(PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "transactionDate")));
     }
}
