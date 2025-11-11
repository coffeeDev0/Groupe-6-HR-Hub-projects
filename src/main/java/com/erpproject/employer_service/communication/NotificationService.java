package com.erpproject.employer_service.communication;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import com.erpproject.employer_service.models.dto.EmployerResult;
import com.erpproject.employer_service.models.dto.UserRequest;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final RabbitTemplate rabbitTemplate;

    public void notifyNewEmployer(EmployerResult employer) {
        rabbitTemplate.convertAndSend(RabbitConfig.EXCHANGE, RabbitConfig.EMPLOYER_ROUTING_KEY, employer);
    }

    public void notifyNewRh(UserRequest rh) {
        rabbitTemplate.convertAndSend(RabbitConfig.EXCHANGE, RabbitConfig.RH_ROUTING_KEY, rh);
    }
}
