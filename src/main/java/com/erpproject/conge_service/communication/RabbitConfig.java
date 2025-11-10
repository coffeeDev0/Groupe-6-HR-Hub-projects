package com.erpproject.conge_service.communication;

import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {
    public static final String EXCHANGE = "employer_exchange";
    public static final String EMPLOYER_QUEUE = "employer_queue";
    public static final String RH_QUEUE = "rh_queue";

    @Bean
    public Queue employerQueue() {
        return new Queue(EMPLOYER_QUEUE, true);
    }

    @Bean
    public Queue rhQueue() {
        return new Queue(RH_QUEUE, true);
    }
}
