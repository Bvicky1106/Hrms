package com.example.Invoice_Hrms.service;


import com.example.Invoice_Hrms.dto.paymentDto;
import com.example.Invoice_Hrms.mapper.paymentMapper;
import com.example.Invoice_Hrms.model.payment;
import com.example.Invoice_Hrms.repository.paymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor


public class paymentService {

    private  final paymentRepository paymentRepository;
    private  final paymentMapper paymentMapper;


    public  paymentDto createPayment(paymentDto dto){
        payment payment = paymentMapper.toEntity(dto);
        return  paymentMapper.toDto(paymentRepository.save(payment));

    }

    public List <paymentDto>getAllPayment(){
        return  paymentRepository.findAll().stream().map(paymentMapper :: toDto).collect(Collectors.toList());

    }

    public   paymentDto getPaymentById(String id){
        return  paymentRepository.findById(id).map(paymentMapper ::toDto).orElse(null);
    }

    public  void deletePayment(String id){
        paymentRepository.deleteById(id);
    }

    public  paymentDto updatePayment(String id,paymentDto dto){
        return  paymentRepository.findById(id).map(existing -> {
            existing.setInvoiceNo(dto.getInvoiceNo());
            existing.setPaymentAmount(dto.getPaymentAmount());
            existing.setPaymentMethod(dto.getPaymentMethod());
            existing.setPaymentDate(dto.getPaymentDate());
            existing.setReferanceNo(dto.getReferenceNo());
            return paymentMapper.toDto(paymentRepository.save(existing));
        }).orElse(null);
    }
}
