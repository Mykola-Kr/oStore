package com.krainyk.ostore.service;

import com.krainyk.ostore.dto.request.DeliveryRequest;
import com.krainyk.ostore.dto.respond.DeliveryRespond;
import com.krainyk.ostore.entity.Delivery;
import com.krainyk.ostore.exceptions.NoMatchesException;
import com.krainyk.ostore.repository.DeliveryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DeliveryService {

    @Autowired
    private DeliveryRepository deliveryRepository;


    private Delivery deliveryRequestToDelivery(Delivery delivery, DeliveryRequest request) {
        if (delivery == null) {
            delivery = new Delivery();
        }
        delivery.setName(request.getName());
        return delivery;
    }

    public void create(DeliveryRequest request) {
        deliveryRepository.save(deliveryRequestToDelivery(null, request));
    }

    public Delivery findOne(Long id) {
        return deliveryRepository.findById(id).orElseThrow(() ->
                new NoMatchesException("Delivery with id " + id + " does not exist."));
    }

    public void update(Long id, DeliveryRequest request) {
        deliveryRepository.save(deliveryRequestToDelivery(findOne(id), request));
    }

    public void delete(Long id) {
        deliveryRepository.delete(findOne(id));
    }

    public List<DeliveryRespond> findAll(Sort.Direction direction, String fieldName) {
        return deliveryRepository.findAll(Sort.by(direction, fieldName))
                                .stream()
                                .map(DeliveryRespond::new)
                                .collect(Collectors.toList());
    }

    public DeliveryRespond findOneRespond(Long id) {
        return new DeliveryRespond(findOne(id));
    }
}
