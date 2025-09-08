package com.example.Invoice_Hrms.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.Set;
import java.util.ArrayList;
import java.util.HashSet;

import com.example.Invoice_Hrms.dto.InvoiceDto;
import com.example.Invoice_Hrms.dto.paymentDto;
import com.example.Invoice_Hrms.mapper.InvoiceMapper;
import com.example.Invoice_Hrms.mapper.paymentMapper;
import com.example.Invoice_Hrms.model.Invoice;
import com.example.Invoice_Hrms.model.Item;
import com.example.Invoice_Hrms.model.payment;
import com.example.Invoice_Hrms.repository.InvoiceRepository;
import com.example.Invoice_Hrms.repository.ItemRepository;
import com.example.Invoice_Hrms.repository.paymentRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private static final Logger logger = LoggerFactory.getLogger(InvoiceService.class);

    private final InvoiceRepository invoiceRepository;
    private final ItemRepository itemRepository;
    private final paymentMapper paymentMapper;
    private final paymentRepository paymentRepository;

    public Invoice save(Invoice invoice) {
        return invoiceRepository.save(invoice);
    }

    public Invoice createInvoice(InvoiceDto dto) {
        // Generate invoice number if not provided
        if (dto.getInvoiceNo() == null || dto.getInvoiceNo().trim().isEmpty()) {
            dto.setInvoiceNo(generateInvoiceNumber());
        }

        // Check for duplicate invoice number
        if (invoiceRepository.existsByInvoiceNo(dto.getInvoiceNo())) {
            throw new IllegalArgumentException("Invoice number already exists: " + dto.getInvoiceNo());
        }

        Invoice invoice = toEntity(dto);
        if (dto.getInvoiceStatus() == null || dto.getInvoiceStatus().trim().isEmpty()) {
            invoice.setInvoiceStatus("New");
        }

        Invoice savedInvoice = invoiceRepository.save(invoice);

        if (dto.getItems() != null && !dto.getItems().isEmpty()) {
            List<Item> items = dto.getItems().stream()
                    .map(i -> {
                        Item item = new Item();
                        item.setItemName(i.getItemName());
                        item.setDescription(i.getDescription());
                        item.setQty(i.getQty());
                        item.setRate(i.getRate());
                        item.setAmount(i.getAmount());
                        item.setInvoiceId(savedInvoice.getId());
                        return item;
                    }).toList();

            itemRepository.saveAll(items);
        }

        return buildInvoiceItemData(savedInvoice);
    }

    public String generateInvoiceNumber() {
        logger.info("Generating invoice number");
        LocalDate currentDate = LocalDate.now();
        String yearMonth = currentDate.format(DateTimeFormatter.ofPattern("yyyyMM"));
        logger.info("Prefix for invoice number: {}", yearMonth);
        Long invoiceCount = invoiceRepository.countByInvoiceNoStartingWith(yearMonth);
        long count = (invoiceCount != null) ? invoiceCount : 0;
        logger.info("Invoice count for prefix {}: {}", yearMonth, count);
        String countStr = String.format("%02d", count + 1);
        String invoiceNumber = yearMonth + countStr;
        logger.info("Generated invoice number: {}", invoiceNumber);
        return invoiceNumber;
    }

    private Invoice toEntity(InvoiceDto dto) {
        Invoice invoice = new Invoice();
        invoice.setId(dto.getId());
        invoice.setInvoiceNo(dto.getInvoiceNo());
        invoice.setInvoiceDate(dto.getInvoiceDate());
        invoice.setInvoiceEmail(dto.getInvoiceEmail());
        invoice.setInvoiceCompanyName(dto.getInvoiceCompanyName());
        invoice.setInvoiceCompanyAddress(dto.getInvoiceCompanyAddress());
        invoice.setInvoicePinCode(dto.getInvoicePinCode());
        invoice.setInvoiceCountry(dto.getInvoiceCountry());
        invoice.setInvoiceMobileNo(dto.getInvoiceMobileNo());
        invoice.setCompanyMobileNo(dto.getCompanyMobileNo());
        invoice.setInvoiceConsultantName(dto.getInvoiceConsultantName());
        invoice.setInvoiceCurrency(dto.getInvoiceCurrency());
        invoice.setInvoiceStatus(dto.getInvoiceStatus());
        invoice.setCompanyName(dto.getCompanyName());
        invoice.setCompanyAddress(dto.getCompanyAddress());
        invoice.setCompanyMobileNo(dto.getCompanyMobileNo());
        invoice.setCompanyEmail(dto.getCompanyEmail());
        invoice.setInvoiceTerms(dto.getInvoiceTerms());
        invoice.setDueDate(dto.getDueDate());
        invoice.setThanksNote(dto.getThanksNote());
        return invoice;
    }

    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll().stream()
                .map(this::buildInvoiceItemData)
                .collect(Collectors.toList());
    }

    public Invoice getInvoiceById(String id) {
        return invoiceRepository.findById(id)
                .map(this::buildInvoiceItemData)
                .orElse(null);
    }

    private Invoice buildInvoiceItemData(Invoice invoice) {
        List<Item> items = itemRepository.findByInvoiceId(invoice.getId());
        invoice.setItems(items);
        return invoice;
    }

    public Invoice updateInvoice(String id, InvoiceDto dto) {
        return invoiceRepository.findById(id).map(existingInvoice -> {
            Invoice updatedInvoice = toEntity(dto);
            updatedInvoice.setId(id);
            Invoice savedInvoice = invoiceRepository.save(updatedInvoice);

            List<Item> existingItems = itemRepository.findByInvoiceId(id);
            Map<String, Item> existingItemMap = existingItems.stream()
                    .filter(i -> i.getId() != null)
                    .collect(Collectors.toMap(Item::getId, i -> i));

            List<Item> updatedItems = new ArrayList<>();
            Set<String> incomingIds = new HashSet<>();

            if (dto.getItems() != null) {
                for (var i : dto.getItems()) {
                    Item item = new Item();
                    item.setItemName(i.getItemName());
                    item.setDescription(i.getDescription());
                    item.setQty(i.getQty());
                    item.setRate(i.getRate());
                    item.setAmount(i.getAmount());
                    item.setInvoiceId(id);

                    if (i.getId() != null && existingItemMap.containsKey(i.getId())) {
                        item.setId(i.getId());
                        incomingIds.add(i.getId());
                    } else {
                        item.setId(null);
                    }

                    updatedItems.add(item);
                }
                itemRepository.saveAll(updatedItems);

                List<Item> toDelete = existingItems.stream()
                        .filter(i -> i.getId() != null && !incomingIds.contains(i.getId()))
                        .toList();

                itemRepository.deleteAll(toDelete);
            }

            return buildInvoiceItemData(savedInvoice);
        }).orElse(null);
    }

    public boolean deleteInvoice(String id) {
        if (!invoiceRepository.existsById(id)) return false;

        invoiceRepository.deleteById(id);
        itemRepository.deleteAll(itemRepository.findByInvoiceId(id));
        return true;
    }

    public InvoiceDto getInvoiceWithAmounts(String invoiceId) {
        Invoice invoice = invoiceRepository.findById(invoiceId).orElseThrow();

        List<Item> items = itemRepository.findByInvoiceId(invoiceId);
        BigDecimal totalAmount = items.stream()
                .map(Item::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<payment> payments = paymentRepository.findByInvoiceNo(invoice.getInvoiceNo());
        BigDecimal paidAmount = payments.stream()
                .map(p -> BigDecimal.valueOf(p.getPaymentAmount()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal pendingAmount = totalAmount.subtract(paidAmount);

        InvoiceDto dto = InvoiceMapper.toDto(invoice);
        dto.setTotalAmount(totalAmount);
        dto.setPaidAmount(paidAmount);
        dto.setPendingAmount(pendingAmount);

        List<paymentDto> paymentDtos = payments.stream()
                .map(paymentMapper::toDto)
                .toList();

        dto.setPayments(paymentDtos);

        return dto;
    }

    public boolean deleteItemById(String itemId) {
        if (!itemRepository.existsById(itemId)) {
            return false;
        }
        itemRepository.deleteById(itemId);
        return true;
    }
    public Invoice updateIsDelete(String id, String isDelete) {
        return invoiceRepository.findById(id).map(invoice -> {
            invoice.setIs_delete(isDelete);
            Invoice savedInvoice = invoiceRepository.save(invoice);
            return buildInvoiceItemData(savedInvoice);
        }).orElse(null);
    }
}