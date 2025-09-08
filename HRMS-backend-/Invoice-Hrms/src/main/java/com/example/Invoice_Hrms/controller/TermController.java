package com.example.Invoice_Hrms.controller;

import com.example.Invoice_Hrms.dto.TermMasterDto;
import com.example.Invoice_Hrms.service.TermMasterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/terms")
@CrossOrigin(origins = "*") // Optional, for frontend access
public class TermController {

    @Autowired
    private TermMasterService termMasterService;

    @GetMapping
    public List<TermMasterDto> getAllTerms() {
        return termMasterService.getAllTerms();
    }
    
    @PostMapping
    public TermMasterDto createTerm(@RequestBody TermMasterDto dto) {
        return termMasterService.postTerm(dto);
    }

}
