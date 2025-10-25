package com.cbs.cbs.Repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cbs.cbs.pojo.Account;

@Repository
public interface AccountRepo extends JpaRepository<Account,String> {

}
