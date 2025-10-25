package com.aies.aies.pojo.model;

import java.util.List;

import com.aies.aies.pojo.Creditor;
import com.aies.aies.pojo.Debtor;
import com.aies.aies.pojo.TransctionEvent;

import lombok.Data;

@Data
public class ModelCreditor {

     private Creditor creditor;
    private List<TransctionEvent> last10TransctionEventsDebits;
    private List<TransctionEvent> last10TransctionEventsCredits;

}
