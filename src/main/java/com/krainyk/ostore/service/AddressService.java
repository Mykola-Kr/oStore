package com.krainyk.ostore.service;

import com.krainyk.ostore.dto.request.AddressRequest;
import com.krainyk.ostore.dto.respond.AddressRespond;
import com.krainyk.ostore.entity.Address;
import com.krainyk.ostore.exceptions.NoMatchesException;
import com.krainyk.ostore.repository.AddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AddressService {

    @Autowired
    private AddressRepository addressRepository;

    // changing request to entity
    private Address addressRequestToAddress(Address address, AddressRequest request) {
        if (address == null) {
            address = new Address();
        }
        address.setRegion(request.getRegion());
        address.setCity(request.getCity());
        address.setStreet(request.getStreet());
        address.setHouseNumber(request.getHouseNumber());
        address.setApartmentNumber(request.getApartmentNumber());
        return address;
    }

    public void create(AddressRequest request) {
        addressRepository.save(addressRequestToAddress(null, request));
    }

    public Address findOne(Long id) {
        return addressRepository.findById(id).orElseThrow(() ->
                new NoMatchesException("Address with id " + id + " does not exist."));
    }

    public void update(Long id, AddressRequest request) {
        addressRepository.save(addressRequestToAddress(findOne(id), request));
    }

    public void delete(Long id) {
        addressRepository.delete(findOne(id));
    }

    public List<AddressRespond> findAll(Sort.Direction direction, String fieldName) {
        return addressRepository.findAll(Sort.by(direction, fieldName))
                                .stream()
                                .map(AddressRespond::new)
                                .collect(Collectors.toList());
    }
}