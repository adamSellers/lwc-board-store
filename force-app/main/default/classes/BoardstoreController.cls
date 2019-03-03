public with sharing class BoardstoreController {

    static Integer PAGE_SIZE = 9;

    // need to come back and fix these for the filters
    public class Filters {
        public String searchKey { get; set; }

        public Decimal maxPrice { get; set; }

        public String[] width { get; set; }

        public String[] flex { get; set; }

        public String[] camber { get; set; }

        public String[] mountingPattern { get; set; }
    }

    @AuraEnabled(Cacheable=true)
    public static PagedResult getBoards(String filters, Integer pageNumber){
        System.debug('the filters are: ' + filters);
        System.debug('the pageNumber is: ' + pageNumber);
        String searchString, whereClause = '';
        Decimal maxPrice;
        String[] width, flex, camber, mountingPattern, criteria = new String[]{};
        if(!String.isEmpty(filters)) {
            Filters productFilters = (Filters) JSON.deserializeStrict(filters, BoardstoreController.Filters.class);
            maxPrice = productFilters.maxPrice;
            if(!String.isEmpty(productFilters.searchKey)) {
                searchString = '%' + productFilters.searchKey + '%';
                criteria.add('Name LIKE :searchString');
            }
            // we want shape, camber, width and flex
            if(productFilters.maxPrice >= 0) {
                maxPrice = productFilters.maxPrice;
                criteria.add('Price__c <= :maxPrice');
            }
            if(productFilters.width != NULL) {
                width = productFilters.width;
                criteria.add('Width__c IN :width');
            }if(productFilters.flex != NULL) {
                flex = productFilters.flex;
                criteria.add('Flex__c IN :flex');
            }if(productFilters.camber != NULL) {
                camber = productFilters.camber;
                criteria.add('Camber__c IN :camber');
            }if(productFilters.mountingPattern != NULL) {
                mountingPattern = productFilters.mountingPattern;
                criteria.add('Mounting_Pattern__c IN :mountingPattern');
            }
            if(criteria.size() > 0 ) {
                whereClause = 'WHERE ' + String.join(criteria, ' AND ');
            }
        }

        String dbQuery = 'SELECT Id, Name, Ability_Level__c, Base__c, Board_Notes__c, Camber__c, Core__c, Description__c, Flex__c, Image_Name__c, Mounting_Pattern__c, Price__c, Shape__c, Sidecut__c, Sidewall__c, Size__c, Snowboard_Type__c, Stance_Setback__c, Width__c from Board__c ' + whereClause + ' ORDER BY Name LIMIT :pageSize OFFSET :offset';
        String countQuery = 'SELECT count() from Board__c ' + whereClause;
        Integer pageSize = BoardstoreController.PAGE_SIZE;
        Integer offset = (pageNumber - 1) * pageSize;
        PagedResult result = new PagedResult();
        result.pageSize = pageSize;
        result.pageNumber = pageNumber;
        System.debug('count query is: ' + countQuery);
        result.totalItemCount = Database.countQuery(countQuery);
        result.records = Database.query(dbQuery);
        return result;
    }
}
