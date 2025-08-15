package net.bd.ebankingbackend.web;


import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.bd.ebankingbackend.dtos.AccountOperationDTO;
import net.bd.ebankingbackend.dtos.CustomerDTO;

import net.bd.ebankingbackend.exceptions.CustomerNotFoundException;
import net.bd.ebankingbackend.service.BankAccountService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@Slf4j // pour afficher les messages de logs

@CrossOrigin("*") // pour autoriser au frontend de lire les donnes pour ne pas blocker
public class CustomerRestController {


    private final BankAccountService bankAccountService;

    @GetMapping("/customers")
    @PreAuthorize("hasAuthority('SCOPE_USER')")
    public List<CustomerDTO> customers() {
        return bankAccountService.listCustomers();
    }

    ///  search customer API
    @GetMapping("/customers/search")
    @PreAuthorize("hasAuthority('SCOPE_USER')")
    public List<CustomerDTO> searchCustomers(@RequestParam(name = "keyword",defaultValue = "")String keyword) {

        return bankAccountService.searchCustomer("%"+keyword+"%");
    }
    //  API pour consulter un Customer par ID
    @GetMapping("/customers/{id}")
    @PreAuthorize("hasAuthority('SCOPE_USER')")
    public CustomerDTO getCustomerById(@PathVariable(name = "id") Long customerId ) throws CustomerNotFoundException {
        return  bankAccountService.getCustomer(customerId);

    }
    // API pour ajouter un customer
    // @RequestBody pour indiquer a spring pour que les donner de customerDto on va la recupere apartir de core de la requette en format JSon
    @PostMapping("/customers")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public CustomerDTO saveCustomer(@RequestBody CustomerDTO customerDTO) {
        return bankAccountService.saveCustomer(customerDTO);
    }

    @PutMapping("/customers/{customerid}")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public  CustomerDTO updateCustomer(@PathVariable Long customerid, @RequestBody CustomerDTO customerDTO) {
        customerDTO.setId(customerid);
        return bankAccountService.updateCustomer(customerDTO);
    }

    @DeleteMapping("/customers/{id}")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public void deleteCustomer(@PathVariable Long id) throws CustomerNotFoundException {
        bankAccountService.deleteCustomer(id);

    }
    @GetMapping("/accounts/{accountId}/operations")
    @PreAuthorize("hasAuthority('SCOPE_USER')")
    public List<AccountOperationDTO> getHistory(@PathVariable String accountId) {
       return  bankAccountService.accountHistory(accountId);
    }

}
