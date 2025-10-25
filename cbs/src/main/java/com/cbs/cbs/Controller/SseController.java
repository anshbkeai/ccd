package com.cbs.cbs.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.cbs.cbs.Service.SseService;

@RestController
@RequestMapping("/sse")
@CrossOrigin("*")
public class SseController {

     @Autowired
    private SseService sseService;

    @GetMapping("/alerts")
    public SseEmitter streamAlerts() {
        return sseService.registerEmitter();
    }

}
