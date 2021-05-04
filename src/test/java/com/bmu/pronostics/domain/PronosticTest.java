package com.bmu.pronostics.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.bmu.pronostics.web.rest.TestUtil;

public class PronosticTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Pronostic.class);
        Pronostic pronostic1 = new Pronostic();
        pronostic1.setId(1L);
        Pronostic pronostic2 = new Pronostic();
        pronostic2.setId(pronostic1.getId());
        assertThat(pronostic1).isEqualTo(pronostic2);
        pronostic2.setId(2L);
        assertThat(pronostic1).isNotEqualTo(pronostic2);
        pronostic1.setId(null);
        assertThat(pronostic1).isNotEqualTo(pronostic2);
    }
}
