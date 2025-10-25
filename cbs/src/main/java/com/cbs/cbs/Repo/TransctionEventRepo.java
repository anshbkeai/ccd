package com.cbs.cbs.Repo;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cbs.cbs.pojo.TransctionEvent;

@Repository
public interface TransctionEventRepo  extends JpaRepository<TransctionEvent,String> {

    List<TransctionEvent> findByDebtor_Account_Id(String debtor_Account_Id,Pageable pageable);
    List<TransctionEvent> findByCreditor_Account_Id(String creditor_Account_Id,Pageable pageable);
    Page<TransctionEvent> findByFlagedTrue(Pageable pageable);

}
