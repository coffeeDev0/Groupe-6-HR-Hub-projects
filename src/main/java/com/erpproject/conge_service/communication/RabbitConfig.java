package com.erpproject.conge_service.communication;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory; // Import Corrigé
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {
    
    // Noms cohérents pour les clés de routage
    public static final String EXCHANGE_NAME = "employer_exchange";
    public static final String EMPLOYER_QUEUE = "employer_queue";
    public static final String RH_QUEUE = "rh_queue";

    // Clés de routage utilisées pour diriger les messages vers les files
    public static final String EMPLOYER_ROUTING_KEY = "key.new.employer";
    public static final String RH_ROUTING_KEY = "key.rh.update";

    // --- 1. Déclaration des Files d'Attente (Queues) ---
    @Bean
    public Queue employerQueue() {
        // durable: true (persistance des files d'attente après redémarrage)
        return new Queue(EMPLOYER_QUEUE, true); 
    }

    @Bean
    public Queue rhQueue() {
        return new Queue(RH_QUEUE, true);
    }

    // --- 2. Déclaration de l'Échange (Exchange) ---
    @Bean
    public TopicExchange exchange() {
        return new TopicExchange(EXCHANGE_NAME);
    }

    // --- 3. Liens (Bindings) : Lier la Queue à l'Exchange ---

    @Bean
    public Binding employerBinding(Queue employerQueue, TopicExchange exchange) {
        return BindingBuilder.bind(employerQueue)
                .to(exchange)
                .with(EMPLOYER_ROUTING_KEY); // La clé qui dirige le message vers cette queue
    }

    @Bean
    public Binding rhBinding(Queue rhQueue, TopicExchange exchange) {
        return BindingBuilder.bind(rhQueue)
                .to(exchange)
                .with(RH_ROUTING_KEY);
    }

    // --- 4. Configuration du Convertisseur JSON (pour la sérialisation/désérialisation) ---
    @Bean
    public Jackson2JsonMessageConverter jackson2JsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    // --- 5. Configuration du Conteneur d'Écoute (Listener Container) ---
    @Bean
    public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory(
        ConnectionFactory connectionFactory, // Import de org.springframework.amqp.rabbit.connection.ConnectionFactory
        Jackson2JsonMessageConverter converter) {
        
        SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
        factory.setConnectionFactory(connectionFactory);
        factory.setMessageConverter(converter);
        return factory;
    }
}