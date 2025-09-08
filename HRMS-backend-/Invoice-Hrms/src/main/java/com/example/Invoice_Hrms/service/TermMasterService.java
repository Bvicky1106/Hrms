package com.example.Invoice_Hrms.service;

import com.example.Invoice_Hrms.dto.TermMasterDto;
import com.example.Invoice_Hrms.model.TermMaster;
import com.example.Invoice_Hrms.repository.TermMasterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TermMasterService {

    @Autowired
    private TermMasterRepository termMasterRepository;

    public List<TermMasterDto> getAllTerms() {
        List<TermMaster> terms = termMasterRepository.findAll();
        return terms.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    private TermMasterDto convertToDto(TermMaster term) {
        TermMasterDto dto = new TermMasterDto();
        dto.setId(term.getId());
        dto.setTerm(term.getTerm());
        dto.setDescription(term.getDescription());
        return dto;
    }
    public TermMasterDto postTerm(TermMasterDto dto) {
        TermMaster term = new TermMaster();
        term.setTerm(dto.getTerm());
        term.setDescription(dto.getDescription());

        TermMaster saved = termMasterRepository.save(term);

        TermMasterDto response = new TermMasterDto();
        response.setId(saved.getId());
        response.setTerm(saved.getTerm());
        response.setDescription(saved.getDescription());
        return response;
    }

}
