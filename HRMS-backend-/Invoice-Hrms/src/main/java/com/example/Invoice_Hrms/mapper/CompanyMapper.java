package com.example.Invoice_Hrms.mapper;

import com.example.Invoice_Hrms.dto.CompanyDto;
import com.example.Invoice_Hrms.model.Company;

public class CompanyMapper {
    public static Company toEntity(CompanyDto dto) {
        Company company = new Company();
        company.setId(dto.getId());
        company.setCompanyName(dto.getCompanyName());
        company.setContactName(dto.getContactName());
        company.setCompanyAddress(dto.getCompanyAddress());
        company.setCompanyCountry(dto.getCompanyCountry());
        company.setCompanyPinCode(dto.getCompanyPinCode());
        company.setCompanyEmail(dto.getCompanyEmail());
        company.setCompanyMobileNo(dto.getCompanyMobileNo());
        company.setLogoUrl(dto.getLogoUrl());
        return company;
    }

    public static CompanyDto toDto(Company company) {
        CompanyDto dto = new CompanyDto();
        dto.setId(company.getId()); // Fixed
        dto.setCompanyName(company.getCompanyName());
        dto.setContactName(company.getContactName());
        dto.setCompanyAddress(company.getCompanyAddress());
        dto.setCompanyCountry(company.getCompanyCountry());
        dto.setCompanyPinCode(company.getCompanyPinCode());
        dto.setCompanyEmail(company.getCompanyEmail());
        dto.setCompanyMobileNo(company.getCompanyMobileNo());
        dto.setLogoUrl(company.getLogoUrl());
        return dto;
    }
}