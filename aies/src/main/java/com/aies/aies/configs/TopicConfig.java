package com.aies.aies.configs;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TopicConfig {

    @Bean
    public NewTopic newTopic() {
        return new NewTopic("txn-topic", 1 , (short)1);
    }
}
